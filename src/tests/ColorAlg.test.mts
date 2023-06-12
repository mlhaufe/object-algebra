import { Algebra } from "../Algebra.mjs";
import { Merge } from "../Merge.mjs";

describe("ColorAlg", () => {
    interface ColorAlg<T> extends Algebra {
        Red(): T;
        Green(): T;
        Blue(): T;
    }

    abstract class ColorData { }
    class Red extends ColorData { }
    class Green extends ColorData { }
    class Blue extends ColorData { }

    class ColorFactory implements ColorAlg<ColorData> {
        Red() { return new Red() }
        Green() { return new Green() }
        Blue() { return new Blue() }
    }

    interface IToHex { toHex(): string }
    class ToHex implements ColorAlg<IToHex> {
        Red(): IToHex {
            return {
                toHex() { return '#ff0000' }
            }
        }
        Green(): IToHex {
            return {
                toHex() { return '#00ff00' }
            }
        }
        Blue(): IToHex {
            return {
                toHex() { return '#0000ff' }
            }
        }
    }

    interface IToRgb { toRgb(): string }
    class ToRgb implements ColorAlg<IToRgb> {
        Red(): IToRgb {
            return {
                toRgb() { return 'rgb(255, 0, 0)' }
            }
        }
        Green(): IToRgb {
            return {
                toRgb() { return 'rgb(0, 255, 0)' }
            }
        }
        Blue(): IToRgb {
            return {
                toRgb() { return 'rgb(0, 0, 255)' }
            }
        }
    }

    test('Merge', () => {
        const foo = 1
        const Color = Merge(ColorFactory, ToHex, ToRgb)

        const color = new Color()

        const red = color.Red()
        const green = color.Green()
        const blue = color.Blue()

        expect(red.toHex()).toBe('#ff0000')
        expect(green.toHex()).toBe('#00ff00')
        expect(blue.toHex()).toBe('#0000ff')

        expect(red.toRgb()).toBe('rgb(255, 0, 0)')
        expect(green.toRgb()).toBe('rgb(0, 255, 0)')
        expect(blue.toRgb()).toBe('rgb(0, 0, 255)')
    })

})