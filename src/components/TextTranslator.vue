<template>
  <div class="translator">
    <div class="input-section">
      <label>Input Text:</label>
      <textarea
        v-model="inputText"
        placeholder="Select text in Word to translate..."
        rows="4"
      ></textarea>

      <div class="settings-group">
        <div class="setting-item">
          <label>Translation Model:</label>
          <select v-model="selectedModel">
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash 8B</option>
          </select>
        </div>

        <div class="setting-item">
          <label>Target Language:</label>
          <select v-model="targetLanguage">
            <option value="zh">Chinese</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="es">Spanish</option>            
          </select>
        </div>

        <div class="setting-item">
          <label>Creativity Level: {{ temperature }}</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="temperature" 
              min="0" 
              max="1" 
              step="0.1"
              class="temperature-slider"
            >
            <div class="slider-labels">
              <span>Literal</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>
        </div>
      </div>

      <button @click="translate" :disabled="isLoading || !inputText">
        {{ isLoading ? 'Translating...' : 'Translate' }}
      </button>
    </div>
    <div class="output-section">
      <label>Translation Result:</label>
      <textarea
        v-model="translatedText"
        placeholder="Translation will appear here..."
        rows="4"
        readonly
      ></textarea>
    </div>
  </div>
</template>

<script lang="ts" setup name="TextTranslator">
import { ref, onMounted } from 'vue'
import { translateText } from '../api/gemini'

const inputText = ref('')
const translatedText = ref('')
const targetLanguage = ref('es')
const temperature = ref(0.7)
const selectedModel = ref('gemini-1.5-flash') 
const isLoading = ref(false)

const getSelectedText = async () => {
  try {
    Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        inputText.value = result.value
      } else {
        console.error('Failed to get selected text:', result.error)
      }
    })
  } catch (error) {
    console.error('Error getting selected text:', error)
  }
}

// Listen for selection changes in Word
onMounted(() => {
  if (typeof Office !== 'undefined') {
    Office.onReady(() => {
      if (Office.context.host === Office.HostType.Word) {
        Office.context.document.addHandlerAsync(
          Office.EventType.DocumentSelectionChanged,
          getSelectedText,
          (result) => {
            if (result.status !== Office.AsyncResultStatus.Succeeded) {
              console.error('Failed to attach event handler:', result.error)
            }
          }
        )
      }
    })
  } else {
    console.warn('Office.js is not available. Make sure the add-in is running inside Word.')
  }
})

const translate = async () => {
  if (!inputText.value.trim()) return
  
  isLoading.value = true
  try {
    const result = await translateText({
      text: inputText.value,
      targetLanguage: targetLanguage.value,
      temperature: temperature.value,
      model: selectedModel.value 
    })
    translatedText.value = result
  } catch (error) {
    console.error('Translation error:', error)
    translatedText.value = 'Error occurred during translation. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>


<style scoped>
.translator {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.main-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-section, .output-section {
  margin-bottom: 20px;
}


.settings-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}


textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

select {
  padding: 8px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}


.slider-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.temperature-slider {
  width: 100%;
  height: 4px;
  background: #dee2e6;
  border-radius: 2px;
  outline: none;
}

.temperature-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #4CAF50;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.temperature-slider::-webkit-slider-thumb:hover {
  background: #45a049;
}

.temperature-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #4CAF50;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.temperature-slider::-moz-range-thumb:hover {
  background: #45a049;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6c757d;
}


button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}
</style> 