if(!(window as any).jasmine.testPath.includes('src/server')) {
  require('jest-preset-angular')
}

const mock = () => {
  let storage: { [key: string]: any } = {}
  return {
    getItem: (key: string) => key in storage ? (<any>storage)[key] : null,
    setItem: (key: string, value: any) => (<any>storage)[key] = value || '',
    removeItem: (key: string) => Object.keys(storage).filter(a => a !== key).reduce((acc, key) => ({ ...acc, [key]: storage[key] }), {}),
    clear: () => storage = {},
  }
}
Object.defineProperty(window, 'CSS', { value: mock() })
Object.defineProperty(window, 'matchMedia', { value: jest.fn(() => ({ matches: true })) })
Object.defineProperty(window, 'localStorage', { value: mock() })
Object.defineProperty(window, 'sessionStorage', { value: mock() })
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    }
  }
})

// For Angular Material
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    }
  },
})

// For Angular Material
// (window as any).Hammer = require('hammerjs')
