Grim = require 'grim'

describe "WrapGuide", ->
  [editor, wrapGuide, workspaceElement] = []

  getLeftPosition = (element) ->
    parseInt(element.style.left)

  beforeEach ->
    workspaceElement = atom.views.getView(atom.workspace)
    workspaceElement.style.height = "200px"
    workspaceElement.style.width = "1500px"

    jasmine.attachToDOM(workspaceElement)

    waitsForPromise ->
      atom.packages.activatePackage('wrap-guide')

    waitsForPromise ->
      atom.packages.activatePackage('language-javascript')

    waitsForPromise ->
      atom.workspace.open('sample.js')

    runs ->
      editor = atom.workspace.getActiveTextEditor()
      wrapGuide = workspaceElement.querySelector(".wrap-guide")

  describe ".activate", ->
    getWrapGuides  = ->
      workspaceElement.querySelectorAll(".underlayer > .wrap-guide")

    it "appends a wrap guide to all existing and new editors", ->
      expect(atom.workspace.getPanes().length).toBe 1
      expect(getWrapGuides().length).toBe 1
      expect(getLeftPosition(getWrapGuides()[0])).toBeGreaterThan(0)

      atom.workspace.getActivePane().splitRight(copyActiveItem: true)
      expect(atom.workspace.getPanes().length).toBe 2
      expect(getWrapGuides().length).toBe 2
      expect(getLeftPosition(getWrapGuides()[0])).toBeGreaterThan(0)
      expect(getLeftPosition(getWrapGuides()[1])).toBeGreaterThan(0)

    it "positions the guide at the configured column", ->
      width = editor.getDefaultCharWidth() * wrapGuide.getDefaultColumn()
      expect(width).toBeGreaterThan(0)
      expect(getLeftPosition(wrapGuide)).toBe(width)
      expect(wrapGuide).toBeVisible()

  describe "when the font size changes", ->
    it "updates the wrap guide position", ->
      initial = getLeftPosition(wrapGuide)
      expect(initial).toBeGreaterThan(0)
      fontSize = atom.config.get("editor.fontSize")
      atom.config.set("editor.fontSize", fontSize + 10)

      advanceClock(1)
      expect(getLeftPosition(wrapGuide)).toBeGreaterThan(initial)
      expect(wrapGuide).toBeVisible()

  describe "when the column config changes", ->
    it "updates the wrap guide position", ->
      initial = getLeftPosition(wrapGuide)
      expect(initial).toBeGreaterThan(0)
      column = atom.config.get("editor.preferredLineLength")
      atom.config.set("editor.preferredLineLength", column + 10)
      expect(getLeftPosition(wrapGuide)).toBeGreaterThan(initial)
      expect(wrapGuide).toBeVisible()

      atom.config.set("wrap-guide.columns", [{pattern: ".*", column: column - 10}])
      expect(getLeftPosition(wrapGuide)).toBeLessThan(initial)
      expect(wrapGuide).toBeVisible()

  describe "when the editor's grammar changes", ->
    it "updates the wrap guide position", ->
      atom.config.set('.source.js', 'editor.preferredLineLength', 20)
      initial = getLeftPosition(wrapGuide)
      expect(initial).toBeGreaterThan(0)
      expect(wrapGuide).toBeVisible()

      editor.setGrammar(atom.grammars.grammarForScopeName('text.plain.null-grammar'))
      expect(getLeftPosition(wrapGuide)).toBeGreaterThan(initial)
      expect(wrapGuide).toBeVisible()

  describe "using a custom config column", ->
    it "places the wrap guide at the custom column", ->
      atom.config.set('wrap-guide.columns', [{pattern: '\.js$', column: 20}])
      wrapGuide.updateGuide()
      width = editor.getDefaultCharWidth() * 20
      expect(width).toBeGreaterThan(0)
      expect(getLeftPosition(wrapGuide)).toBe(width)

    it "uses the default column when no custom column matches the path", ->
      atom.config.set('wrap-guide.columns', [{pattern: '\.jsp$', column: '100'}])
      wrapGuide.updateGuide()
      width = editor.getDefaultCharWidth() * wrapGuide.getDefaultColumn()
      expect(width).toBeGreaterThan(0)
      expect(getLeftPosition(wrapGuide)).toBe(width)

    it "hides the guide when the config column is less than 1", ->
      atom.config.set('wrap-guide.columns', [{pattern: 'sample\.js$', column: -1}])
      wrapGuide.updateGuide()
      expect(wrapGuide).toBeHidden()

    it "ignores invalid regexes", ->
      atom.config.set('wrap-guide.columns', [{pattern: '(', column: -1}])
      expect(-> wrapGuide.updateGuide()).not.toThrow()

    it "places the wrap guide at the custom column using scope name", ->
      atom.config.set('wrap-guide.columns', [{scope: 'source.js', column: 20}])
      wrapGuide.updateGuide()
      width = editor.getDefaultCharWidth() * 20
      expect(width).toBeGreaterThan(0)
      expect(getLeftPosition(wrapGuide)).toBe(width)

    it "uses the default column when no scope name matches", ->
      atom.config.set('wrap-guide.columns', [{scope: 'source.gfm', column: '100'}])
      wrapGuide.updateGuide()
      width = editor.getDefaultCharWidth() * wrapGuide.getDefaultColumn()
      expect(width).toBeGreaterThan(0)
      expect(getLeftPosition(wrapGuide)).toBe(width)

    it "favors the first matching rule", ->
      atom.config.set('wrap-guide.columns', [{pattern: '\.js$', column: 20},
                                             {pattern: 'sample\.js$', column: 30}])
      wrapGuide.updateGuide()
      width = editor.getDefaultCharWidth() * 20
      expect(width).toBeGreaterThan(0)
      expect(getLeftPosition(wrapGuide)).toBe(width)

  describe 'scoped config', ->
    it '::getDefaultColumn returns the scope-specific column value', ->
      atom.config.set('.source.js', 'editor.preferredLineLength', 132)

      expect(wrapGuide.getDefaultColumn()).toBe 132

    it 'updates the guide when the scope-specific column changes', ->
      spyOn(wrapGuide, 'updateGuide')

      column = atom.config.get(editor.getRootScopeDescriptor(), 'editor.preferredLineLength')
      atom.config.set('.source.js', 'editor.preferredLineLength', column + 10)

      expect(wrapGuide.updateGuide).toHaveBeenCalled()

    it 'updates the guide when wrap-guide.enabled is set to false', ->
      expect(wrapGuide).toBeVisible()

      atom.config.set('.source.js', 'wrap-guide.enabled', false)

      expect(wrapGuide).not.toBeVisible()

  describe 'converting old configuration', ->
    beforeEach ->
      atom.packages.deactivatePackage('wrap-guide')

    it 'converts old package-specific scoped config to new Atom style', ->
      atom.config.set('wrap-guide.columns', [{scope: 'source.gfm', column: 100}])

      waitsForPromise ->
        atom.packages.activatePackage('wrap-guide')

      runs ->
        expect(atom.config.get(['source.gfm'], 'editor.preferredLineLength')).toBe 100
        expect(atom.config.get('wrap-guide.columns')).toBeUndefined()

    it 'converts package-specific scoped config of -1 to wrap-guide.enabled = false', ->
      atom.config.set('wrap-guide.columns', [{scope: 'source.gfm', column: -1}])

      waitsForPromise ->
        atom.packages.activatePackage('wrap-guide')

      runs ->
        expect(atom.config.get(['source.gfm'], 'wrap-guide.enabled')).toBe false
        expect(atom.config.get('wrap-guide.columns')).toBeUndefined()

    it 'does not convert pattern column settings', ->
      atom.config.set('wrap-guide.columns', [{pattern: '\.js$', column: 100}])

      waitsForPromise ->
        atom.packages.activatePackage('wrap-guide')

      runs ->
        expect(atom.config.get('wrap-guide.columns')).toEqual [{pattern: '\.js$', column: 100}]

    it 'deprecates pattern column settings', ->
      spyOn(Grim, 'deprecate')
      atom.config.set('wrap-guide.columns', [{pattern: '\.js$', column: 100}])

      waitsForPromise ->
        atom.packages.activatePackage('wrap-guide')

      runs ->
        expect(Grim.deprecate).toHaveBeenCalled()