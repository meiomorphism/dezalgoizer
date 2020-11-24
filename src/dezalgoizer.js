(() => {
  const selections = window.getSelection();

  // Convenience iterator over the selection range object.
  //
  // Firefox, almost uniquely among browsers, allows multiple selection ranges.
  // (Hold Ctrl while selecting!) We mostly handle this correctly, but we do
  // assume throughout that the selection ranges don't overlap. Firefox doesn't
  // _guarantee_ that, but it's almost always true in practice, and it's rarely
  // more than a cosmetic issue when it fails.
  function* getSelections() {
    for (let i = 0; i < selections.rangeCount; ++i) {
      yield selections.getRangeAt(i);
    }
  }

  // A regex matching the most common Zalgotext characters.
  //
  // This is not merely the regex `/\p{Mn}|\p{Me}/ug`. Instead, we limit this to
  // characters which are in the Basic Multilingual Plane, and which are
  // associated with either the Latin alphabet, the Cyrillic alphabet, or with
  // no particular script at all.
  //
  // * We do not attempt to match astral combining characters, such as the
  //   combining musical characters in the SMP, since some regex engines have
  //   issues matching them. In Firefox 26, this would actually result in the
  //   underlying text being removed! (This has likely been resolved since --
  //   possibly by the introduction of the `u` flag -- but testing is needed to
  //   confirm that.)
  //
  // * We do not attempt to match characters in scripts other than Latin and
  //   Cyrillic because many scripts - notably, all of the Brahmic scripts -
  //   rely on combining characters to form ordinary, day-to-day text. (We will,
  //   alas, still destroy properly-encoded Yoruba -- but then again, so does
  //   Zalgoification.
  //
  // At any rate, Zalgoifier writers seem to generally just use characters from
  // those Unicode blocks designated specifically for combining characters, so
  // complete coverage isn't necessary.
  //
  const combiningCharacters = /[\u0300-\u036F]|[\u0483-\u0489]|[\u1AB0-\u1AFF]|[\u1DC0-\u1DFF]|[\u20D0-\u20FF]|[\u2DE0-\u2DFF]|[\uA66F-\uA67D]|\uA69E|\uA69F|[\uFE20-\uFE2F]/ug;

  // Accumulator for replacement selection-ranges. (This will be used to fix up
  // the selection after we modify the text out from under it.)
  const newRanges = [];

  for (const selection of getSelections()) {
    if (!selection || selection.collapsed) continue;

    // Strip all combining characters from a particular substring [a,b)
    // of a string.
    const dezalgoizeSpan = (str, a, b) => (
        str.slice(0, a)
        + str.slice(a, b).replace(combiningCharacters, "")
        + str.slice(b)
    );
    // Strip all combining characters from a particular substring [a,b)
    // of a text-node's contents.
    const dezalgoizeNodeSpan = (node, a, b) => {
      node.nodeValue = dezalgoizeSpan(node.nodeValue, a, b);
    }

    // Shorter aliases. Also, and far more importantly, save the selection state
    // for later restoration.
    const nodeS = selection.startContainer;
    const nodeE = selection.endContainer;
    const offsetS = selection.startOffset;
    const offsetE = selection.endOffset;
    // End co-offset: the distance from the end of the node's text to the end of
    // the selection. (This computation will be inverted later to compute the
    // correct selection location.)
    const coOffsetE = nodeE.nodeValue != undefined
      ? nodeE.nodeValue.length - offsetE
      : 0;

    // DOM traversal. Yields arguments to `dezalgoizeNodeSpan`, above.
    function* findSelectedSpans(node) {
      if (!selection.intersectsNode(node)) return;
      if (node.nodeValue) {
        yield [
          node,
          node === nodeS ? offsetS : 0,
          node === nodeE ? offsetE : node.nodeValue.length
        ];
      } else {
        for (let C of node.childNodes)
          yield* findSelectedSpans(C);
      }
    }

    // Run over all the nodes starting from a convenient root...
    for (const span of findSelectedSpans(selection.commonAncestorContainer)) {
      // ... and alter each of the (partially-)selected text nodes in-place.
      dezalgoizeNodeSpan(...span)
    }

    // Compute and save the new selection, to be restored once we've been through
    // all the subselections.
    const newOffsetE = nodeE.nodeValue != undefined
      ? nodeE.nodeValue.length - coOffsetE
      : offsetE;
    const newRange = new Range();
    newRange.setStart(nodeS, offsetS);
    newRange.setEnd(nodeE, newOffsetE);
    newRanges.push(newRange);
  }

  // This happens when all the ranges in the selection are "collapsed" (i.e., of
  // length 0). That may be because there are no ranges, but not necessarily --
  // Firefox and Chrome both use a collapsed selection object to indicate a
  // place where the user has clicked on text.
  if (!newRanges.length) {
    alert("No text selected to dezalgoize!");
    return;
  }

  // Reselect the previously-selected text.
  selections.removeAllRanges();
  for (const r of newRanges) { selections.addRange(r) };
})();
