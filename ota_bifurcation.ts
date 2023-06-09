import 'dotenv/config'
import inquirer, { Question } from 'inquirer'
import autocomplete from 'inquirer-autocomplete-prompt'
// import shell from 'shelljs';
import fs from 'fs'
import fuzzy from 'fuzzy'
import { exec } from 'node:child_process'
import AutocompletePrompt from 'inquirer-autocomplete-prompt'

inquirer.registerPrompt('autocomplete', autocomplete)

const getDirectories = (source: string) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name)

const askQuestions = (directories: string[]) => {
  const questions: Array<AutocompletePrompt.AutocompleteQuestionOptions> = [
    {
      type: 'autocomplete',
      name: 'DIRECTORY',
      message: 'Hey! Pick a Challenge 🕘',
      source: async (_answers, input) => {
        const fuzzied = fuzzy.filter(input || '', directories)
        return fuzzied.map((el) => el.string)
      },
    },
  ]

  return inquirer.prompt(questions)
}

// const cp = exec(
//   `python3 ~/.platformio/packages/framework-arduinoespressif32/tools/espota.py -i BIF_CONT_00.local -f ~/WebDev/bifurcation/firmware/development/esp32-s2-development/Prototyping_Toolkit/.pio/build/esp32-s2-saola-1/firmware.bin -a ${process.env.OTA_PASS}`
// )

// cp.on('close', (code) => {
//   console.log(`child process exited with code ${code}`)
// })

const run = () => {
  if (!process.env.FIRMWARE_ROOT) {
    console.error('FIRMWARE_ROOT not provided')
    return
  }

  const directories = getDirectories(process.env.FIRMWARE_ROOT)
  if (!directories.length) {
    console.error('No directories found!')
    return
  }
  console.log(directories)
}

run()
