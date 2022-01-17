import type {Config} from "@jest/types"

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    testRegex: "(/src/__unittests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
  }
}
