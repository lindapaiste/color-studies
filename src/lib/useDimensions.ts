import { useState, useCallback, useLayoutEffect } from "react";

/**
 * modified from https:// github.com/Swizec/useDimensions
 *
 * is available on npm as react-use-dimensions, but had typescript issues
 */

export type UseDimensionsHook = [
  (node: HTMLElement | null) => void, // ref
  Partial<DOMRect>, // can do Partial<DOMRect> and default to {} or do DOMRect | undefined.  partial makes destructuring easier, but undefined is easier to filter out
  HTMLElement | null
];

export interface UseDimensionsArgs {
  liveMeasure?: boolean;
}

function useDimensions({
  liveMeasure = true,
}: UseDimensionsArgs = {}): UseDimensionsHook {
  const [dimensions, setDimensions] = useState<DOMRect | {}>({});
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      const measure = () =>
        window.requestAnimationFrame(() =>
          setDimensions(node.getBoundingClientRect())
        );
      measure();

      if (liveMeasure) {
        window.addEventListener("resize", measure);
        window.addEventListener("scroll", measure);

        return () => {
          window.removeEventListener("resize", measure);
          window.removeEventListener("scroll", measure);
        };
      }
    }
  }, [node, liveMeasure]);

  return [ref, dimensions, node];
}

export default useDimensions;
