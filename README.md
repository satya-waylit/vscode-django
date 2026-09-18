# Django extension for Visual Studio Code

> Beautiful syntax and scoped snippets for perfectionists with deadlines

![Syntax with Gruvbox](images/vscode-django-syntax-gruvbox.png)

## Features

### Go to definition in templates

Ctrl+click (cmd+click on MacOS) or press F12 on the template path in a `include` or `extends` tag
to jump to this template

### Snippets

- Support for selected text (when inserting snippet from the menu)
- Support for copied text
- No unnecessary new lines

### Improved syntax

- Adds the filetype `django-html`
- Adds the filetype `django-txt` for email templates.
- Better syntax with more operators and default keywords:
  - Known default tags and filters
  - Known templatetags namespace from contrib in the {% load %} tag
  - Known keywords in tags, like: `as`, `asvar`, `with`, `trimmed`…
- Syntax highlighting everywhere in your HTML document:
  - In the HTML tag itself"
  - In the id, class or any attribute
  - In inline CSS or Javascript code

## Tricks

### Gettext and internationalization

Dealing with `django.po` files?
Consider installing the [Gettext extension](https://marketplace.visualstudio.com/items?itemName=mrorz.language-gettext) by MrOrz.

### Emmet

Add the following item to the **Emmet: Include Languages** settings:

| Item          | Value  |
| ------------- | ------ |
| `django-html` | `html` |

## Sponsors

- [tpberntsen](https://github.com/tpberntsen)
- [moving-content](https://github.com/moving-content)

[![Paypal](https://img.shields.io/static/v1?label=Paypal&message=€66&logo=Paypal&color=009cde&link=https://www.paypal.com/paypalme/batisteo/5)](https://www.paypal.com/paypalme/batisteo/5)
[![Github Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=6%C2%A0%E2%9D%A4&logo=GitHub&color=ea4aaa&link=https://github.com/sponsor/batisteo)](https://github.com/sponsor/batisteo)

## Contributing

### Issues

Something odd? New feature request?
Please [create an issue on Github](https://github.com/vscode-django/vscode-django/issues/new).

### Setup

The extension builds with [pnpm](https://pnpm.io) and [Vite](https://vite.dev),
and needs Node 20.19 or later.

```bash
git clone https://github.com/vscode-django/vscode-django
cd vscode-django
pnpm install
code .
```

[oxlint](https://oxc.rs) lints the code and [oxfmt](https://oxc.rs) formats it.
Install the [Oxc extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
to see both in the editor.

| Command        | What it does                                        |
| -------------- | --------------------------------------------------- |
| `pnpm compile` | Builds the extension into `out/`                    |
| `pnpm watch`   | Rebuilds on every change                            |
| `pnpm test`    | Compiles, typechecks, lints, then runs the tests    |
| `pnpm lint`    | Runs oxlint; `pnpm lint:fix` applies the fixes      |
| `pnpm format`  | Runs oxfmt; `pnpm format:check` only reports        |
| `make syntax`  | Rebuilds the grammars from the TOML in `syntaxes/`  |

`make syntax` runs its Python script through [Poetry](https://python-poetry.org),
which you need only when editing the grammars.

### Launching the extension debugger

Make sure you have this snippet in `.vscode/launch.json`:

```javascript
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Extension",
      "type": "extensionHost",
      "request": "launch",
      "runtimeExecutable": "${execPath}",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}"
      ]
    }
  ]
}
```

Press <kbd>F5</kbd> or click on Debug then Start (▶️) to launch the extension host window.

Hack around

Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F5</kbd> or 🔄 to reload.
