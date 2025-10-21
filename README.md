> [!IMPORTANT]
> Thanks for using my template. You should create a new repository from this template then follow the setup instructions below. After setup, you should replace this README with your own.

## Pack Setup
1. If you wish to make a Modrinth pack instead of CurseForge, replace `./packwiz cf` in [build.yml](.github/workflows/build.yml#L23) with `./packwiz mr`. Make sure you commit this before the next step.
2. In your repository in GitHub, go to **Settings**, **Pages**, then set **Branch** to `main` and then hit **Save**. To use pages with a non-enterprise GitHub account, your repository needs to be public.
3. Go to **Actions** and wait for the `pages-build-deployment` workflow to finish.
4. Finish [Setting up your local environment](CONTRIBUTING.md#setting-up-your-local-environment).
5. You'll likely want to change your `pack.toml` file from the [default](https://github.com/lonevox/mc-modpack-template/blob/main/pack.toml). The easiest way to do this is to re-initialize `pack.toml` with `./packwiz init -r`. If you're editing `pack.toml` manually, see [here](https://packwiz.infra.link/reference/pack-format/pack-toml/) for the file format (remember to run `./packwiz refresh` after manually editing any Packwiz toml files).
6. If you've edited any Packwiz toml files, and if using the pre-launch command, you need to disable the pre-launch command or commit your changes and wait for the workflow run to complete before running Minecraft. Remeber that if your pre-launch command is active, whatever is in your remote [pack.toml](/pack.toml) is used instead of your local `pack.toml`.

> [!NOTE]
> Every time you commit to main, a new build of your pack will be made, overwriting the previous build at [latest-dev](/../../releases/tag/latest-dev).
