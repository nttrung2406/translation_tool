/* eslint-disable vue/multi-word-component-names */
<template>
  <div class="translator">
    <div class="main-section">
      <div class="input-group">
        <label>Input Text:</label>
        <textarea
          v-model="inputText"
          placeholder="Select text in Word to translate..."
          rows="3"
        ></textarea>
      </div>

      <div class="settings-group">
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

      <button @click="translate" :disabled="isLoading || !inputText" class="translate-btn">
        {{ isLoading ? 'Translating...' : 'Translate' }}
      </button>

      <div class="output-group">
        <label>Translation Result:</label>
        <textarea
          v-model="translatedText"
          placeholder="Translation will appear here..."
          rows="3"
          readonly
        ></textarea>
      </div>
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
const isLoading = ref(false)

// Function to get selected text from Word
const getSelectedText = async () => {
  try {
    await Word.run(async (context) => {
      const range = context.document.getSelection()
      range.load('text')
      await context.sync()
      inputText.value = range.text
    })
  } catch (error) {
    console.error('Error getting selected text:', error)
  }
}

// Listen for selection changes in Word
onMounted(() => {
  // @ts-ignore
  Office.onReady(() => {
    // @ts-ignore
    Word.run(async (context) => {
      context.document.addHandler(Word.EventType.selectionChanged, getSelectedText)
      await context.sync()
    })
  })
})

const translate = async () => {
  if (!inputText.value.trim()) return
  
  isLoading.value = true
  try {
    const result = await translateText({
      text: inputText.value,
      targetLanguage: targetLanguage.value,
      temperature: temperature.value
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
  padding: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.main-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group, .output-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}

select {
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
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

.translate-btn {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.translate-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.translate-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style> 