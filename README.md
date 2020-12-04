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

To unlink:
```
npm unlink @openlattice/lattice-community-restorative-court --no-save && npm i
```