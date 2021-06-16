import { useCallback, useLayoutEffect, useState } from "react";

/**
 * modified from https://github.com/Swizec/useDimensions
 *
 * is available on npm as react-use-dimensions, but had typescript issues
 */

export type UseDimensionsHook = [
  (node: HTMLElement | null) => void, // ref
  Partial<DOMRect>, // can do Partial<DOMRect> and default to {} or do DOMRect | undefined.  partial makes destructuring easier, but undefined is easier to filter out
  HTMLElement | null
];

export interface UseDimensionsArgs {
  measureOnScroll?: boolean;
  measureOnResize?: boolean;
}

export default function useDimensions({
  measureOnScroll = false,
  measureOnResize = true,
}: UseDimensionsArgs = {}): UseDimensionsHook {
  const [dimensions, setDimensions] = useState<DOMRect | {}>({});
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((newNode: HTMLElement | null) => {
    setNode(newNode);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      const measure = () =>
        window.requestAnimationFrame(() =>
          setDimensions(node.getBoundingClientRect())
        );
      measure();

      if (measureOnScroll) {
        window.addEventListener("scroll", measure);
      }
      if (measureOnResize) {
        window.addEventListener("resize", measure);
      }
      return () => {
        window.removeEventListener("resize", measure);
        window.removeEventListener("scroll", measure);
      };
    }
    // return empty cleanup function to hush eslint consistent-return errors
    return () => undefined;
  }, [node, measureOnResize, measureOnScroll]);

  return [ref, dimensions, node];
}
