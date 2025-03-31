declare namespace Word {
  interface Context {
    document: Document;
    sync(): Promise<void>;
  }

  interface Document {
    getSelection(): Range;
    addHandler(eventType: EventType, handler: () => void): void;
  }

  interface Range {
    text: string;
    load(option: string): void;
  }

  enum EventType {
    selectionChanged = 'selectionChanged'
  }

  function run(callback: (context: Context) => Promise<void>): Promise<void>;
}

declare namespace Office {
  function onReady(callback: () => void): void;
} 