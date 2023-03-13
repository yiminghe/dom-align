import { getParent } from './get-parent'

describe(getParent.name, () => {
  it('basic', () => {
    const childDiv = document.createElement('div')
    const parentDiv = document.createElement('div')

    parentDiv.appendChild(childDiv)
    document.body.appendChild(parentDiv)

    parentDiv.attachShadow({ mode: 'open' })

    expect(getParent(childDiv)).toBe(parentDiv)
    expect(getParent(parentDiv)).toBe(document.body)
    expect(getParent(parentDiv.shadowRoot as ShadowRoot)).toBe(parentDiv)
    expect(getParent(document.body)).toBe(document.documentElement)
    expect(getParent(document.documentElement)).toBe(document)
    expect(getParent(document)).toBe(null)

    parentDiv.remove()
  })
})
