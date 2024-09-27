type Color = {
    r: number
    g: number
    b: number
    a: number
}

export const colorRGBA = (color: Color) => {
    if (!color) return
    const { r, g, b, a } = color

    const to255 = (value: number) => Math.round(value * 255)
    const toPercentage = (value: number) => Math.round(value * 100)

    if (to255(r) === 0 && to255(g) === 0 && to255(b) === 0 && toPercentage(a) === 100) {
        return "black"
    }

    return `[rgba(${to255(r)},${to255(g)},${to255(b)},${toPercentage(a)})]`
}

