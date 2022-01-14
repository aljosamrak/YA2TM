import "reflect-metadata"
import * as React from "react"
import { container } from "../inversify/inversify.config"
import { Logger } from "../services/Logger"
import { USER_PREFERENCES, UserPreferences } from "../storage/Key"
import { LocalStorage } from "../storage/LocalStorage"
import { TYPES } from "../inversify/types"

const appStyles = require("./App.scss")

class App extends React.Component<{}, { prefs: UserPreferences }> {
  logger = container.get<Logger>(TYPES.Logger)
  localStorage = container.get<LocalStorage>(TYPES.LocalStorageService)

  public componentWillMount() {
    // read options from storage, with default values
    this.localStorage.get(USER_PREFERENCES).then((result) => {
      this.state = {
        prefs: result["user-preferences"],
      }
      this.setState(this.state)
    })
  }

  public render() {
    if (this.state === null || this.state.prefs === null) {
      return <div> Loading... </div>
    } else {
      return (
        <div className={appStyles.app}>
          <div className="optionsBox">
            <h4>Enable changing badge</h4>
            <input
              type="checkbox"
              // onMouseEnter={this.props.tabLimitText}
              onChange={this.handleChangingBadge}
              checked={this.state.prefs.changingBadge}
              id="enable_changing_badge"
              name="enable_changing_badge"
            />
            <h4>Desired max tabs</h4>
            <div className="toggle-box">
              <input
                type="number"
                // onMouseEnter={this.props.tabLimitText}
                onChange={this.handleDesiredTabs}
                value={this.state.prefs.desiredTabs}
                id="enable_tabLimit"
                name="enable_tabLimit"
              />
              <div className="option-description">
                What's your preferred number of total tabs that you would like
                to have.
                <br />
                <i>By default: 20</i>
                <br />
                <i>Suggested value: 20</i>
              </div>
            </div>
          </div>
          <div>
            <button onClick={this.handleSaveClick}>Save</button>
          </div>
        </div>
      )
    }
  }

  private handleChangingBadge = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.state = {
      prefs: {
        changingBadge: e.target.checked,
        desiredTabs: this.state.prefs.desiredTabs,
      },
    }
    this.setState(this.state)
  }

  private handleDesiredTabs = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.state = {
      prefs: {
        changingBadge: this.state.prefs.changingBadge,
        desiredTabs: e.target.valueAsNumber,
      },
    }
    this.setState(this.state)
  }

  private handleSaveClick = () => {
    this.localStorage.set(USER_PREFERENCES, this.state.prefs)
  }
}

export default App
