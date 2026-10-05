# Credits and third-party notices

## Users Garden and 3D pond scene

Original project work is by [Internet Development Studio Company](https://internet.dev), Copyright (c) 2024-2026. This includes the scene composition, painted landscape rendering, koi and lily rendering, pond navigation, Life integration, frame integration, and resource lifecycle. It is free to use under the [MIT License](LICENSE.md), including commercially, with the company copyright and full license notice retained.

The scene's wave solver and procedural noise are implemented for Users Garden. The wave solver uses current and previous height fields, a nine-point spatial stencil, and compact polynomial disturbances. The noise generator uses an integer hash of lattice coordinates.

## Dependency notices

The application also includes vendored utilities and package dependencies. Their copyright and license notices remain in their source files and distributed license files and must be preserved when that code is reused. These are dependency license notices, separate from the company's scene and artwork credits.

## Artwork

The artwork in `public/artwork/` is supplied by Internet Development Studio Company under the [MIT License](public/artwork/LICENSE.txt), with the company copyright and full license notice retained when reused. This covers `garden-frame.jpg`, both koi atlases, the lily pad and petal textures, the tree-line texture, and accompanying prompt files.

The frame artwork at `public/artwork/garden-frame.jpg` is the existing Users Garden login image, previously served from the project's public Internet Development S3 bucket. The koi atlases and tree-line texture were generated for Users Garden with the built-in image tool; the exact prompts are saved beside them as `.prompt.txt` files.
