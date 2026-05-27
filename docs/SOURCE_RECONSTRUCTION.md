# Source Reconstruction Notes

The current repo contains compiled site output, not the original source project.

## Available Clues

Source maps in `assets/` include `sources` and at least some `sourcesContent` entries. These may help reconstruct a React-style source tree.

Technology signals found in maps and chunks include:

- React
- Framer Motion
- Lucide React
- router chunks
- email-related chunk

## Reconstruction Is A Separate Project

Do not silently convert this repo into a new app scaffold.

If source reconstruction is approved:

1. Preserve the current live snapshot on a branch or tag.
2. Extract source-map `sourcesContent` into a separate working directory.
3. Identify dependencies from imports and bundle metadata.
4. Create a minimal `package.json` only after dependency evidence is collected.
5. Rebuild and compare output against current public behavior.
6. Keep reconstructed source and live snapshot changes in separate commits.

## Do Not Overclaim

Source maps can help recover source, but the result may still be incomplete:

- environment variables may be missing,
- original build config may be missing,
- comments and file structure may be partial,
- generated chunks may include third-party source,
- recovered code may not be production-authoritative.

Treat reconstructed source as a candidate until it can build and match the live site.
