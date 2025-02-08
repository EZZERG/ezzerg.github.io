declare global {
  interface Window {
    VANTA: {
      WAVES: (config: any) => {
        destroy: () => void;
      };
    };
  }
}

export {}
