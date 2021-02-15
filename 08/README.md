
# React

React je knihovna pro tvorbu uživatelského rozhranní. Vychází z funkcionálního paradigmatu

## Next.js

Devstack.. TODO

```
npx create-next-app
```

Po vytvoření vidíme úvodní stránku s několika odkazy.

Projekt budeme strukturovat následovně - veškeré nezávislé a znovupoužitelné komponenty budeme ukládat do složky components

```
mkdir components
```

Tu je vhodné rozdělit také na příslušné sekce

```
mkdir components/common
```

Složka common bude obsahovat společné komponenty v rámci celého projektu.

### Favicon

jako jednu z prvních změn je, že si můžeme nastavit vlastní faviconu. Doporučuji pro jednoduché vygenerování loga použít [favicon.io](https://favicon.io/favicon-generator/), kde se dají vygenerovat velmi hezké ikonky z ASCII znaků.