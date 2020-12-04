### lattice-community-restorative-court

To develop and symlink locally:

```
npm run build:prod
npm link
```

In the consuming project:
```
npm link @openlattice/lattice-community-restorative-court
```

During development, any changes to this module will require rebuilding and restarting atrium
```
npm run build:prod
```

To unlink:
```
npm unlink @openlattice/lattice-community-restorative-court --no-save && npm i
```