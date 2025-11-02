This pack uses [Packwiz](https://github.com/packwiz/packwiz) to manage mod versions and for distribution. You can find the relavant docs at <http://packwiz.infra.link>.

## Setting up your local environment

### Using [Packwiz Installer](https://packwiz.infra.link/tutorials/installing/packwiz-installer/) (highly recommended)

1. Download the latest build of the pack from [latest-dev](/../../releases/tag/latest-dev).
2. Create an instance of the pack by loading the ZIP file you just downloaded into [Prism Launcher](https://prismlauncher.org/) (or your launcher of choice, but it *must* have the ability to specify a pre-launch command for modpacks).
3. Clone this repository into the `minecraft` folder of the newly created instance (the `.git` directory and all other repository files should be directly within the `minecraft` folder, not in a sub-directory). If you're unable to clone because there are already folders and/or files in the `minecraft` folder, just delete all the `minecraft` folder contents and try clone again.
4. Run either [packwiz-download-latest.sh](/packwiz-download-latest.sh) for Linux and MacOS, or [packwiz-download-latest.bat](/packwiz-download-latest.bat) for Windows. You may need to give execute permissions to the script before running it. If you're unable to run the script, you can download the latest build of Packwiz for your operating system from [here](https://nightly.link/packwiz/packwiz/workflows/go/main) and extract it to the instance's `minecraft` directory.
5. In Prism Launcher, click on your instance, then click "Edit" on the right, then go to the "Settings" section, then go to the "Custom Commands" tab. Here you need to enable Custom Commands, and add `"$INST_JAVA" -jar packwiz-installer-bootstrap.jar https://lonevox.github.io/CardHunters/pack.toml` as the pre-launch command. This will run Packwiz Installer whenever you launch the pack, which will automatically download the newest versions of files from this repository. If you ever don't want this behaviour (such as when updating a mod, as Packwiz Installer will download the old version of the mod if it is no longer there), you can simply turn the pre-launch command off. Unfortunately, Prism Launcher [forgets the command](https://github.com/PrismLauncher/PrismLauncher/issues/704) when you turn this setting off, so you will need to paste it again.
6. Open the `minecraft` directory in your editor of choice. You can now start editing! Changes that you make will take effect in your Minecraft instance, and can be comitted to your remote. If you change any Packwiz toml files, you should either disable the pre-launch command (recommended), or commit them and wait for the workflow run to finish before launching Minecraft. Remeber that if your pre-launch command is active, whatever is in your remote [pack.toml](/pack.toml) is used instead of your local `pack.toml`.

### Not using Packwiz Installer

1. Clone the repository.
2. Download the latest build of the pack from [latest-dev](/../..releases/tag/latest-dev).
3. Import the pack into your Minecraft launcher of choice.
4. Open the instance directory and enter the `minecraft` directory.
5. Run either [packwiz-download-latest.sh](/packwiz-download-latest.sh) for Linux and MacOS, or [packwiz-download-latest.bat](/packwiz-download-latest.bat) for Windows. You may need to give execute permissions to the script before running it. If you're unable to run the script, you can download the latest build of Packwiz for your operating system from [here](https://nightly.link/packwiz/packwiz/workflows/go/main) and extract it to the instance's `minecraft` directory.
6. You're now free to change files or add mods in the instance folder that was created in step 3 after importing.
7. To commit your changes, copy your edits in the instance folder to the folder in which you cloned this repository.

**NOTE for not using Packwiz Installer:** Whenever you update your local repo from `master`, make sure to also update your local instance by downloading the newest version of the pack from `latest-dev` and deleting your old instance (you can move your worlds to the new instance if desired). This avoids "but it works on my machine!" issues due to your changes working on your old instance, but not necessarily working on the newest version of the pack. This is why using Packwiz Installer is recommended, but this workflow can still be used if Packwiz Installer doesn't work for you for some reason.
