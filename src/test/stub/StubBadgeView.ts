import { BadgeView } from '../../view/BadgeView'

class StubBadgeView implements BadgeView {
  private _text = ''
  private _color = ''

  setText(text: string): void {
    this._text = text
  }

  setBackgroundColor(color: string): void {
    this._color = color
  }

  getText(): string {
    return this._text
  }

  getBackgroundColor(): string {
    return this._color
  }
}

export { StubBadgeView }
