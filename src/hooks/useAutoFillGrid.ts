import { useEffect, useMemo, useRef, useState } from "react";

interface UseAutoFillGridOptions {
  itemCount: number;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  onFetchNextPage: () => void | Promise<unknown>;
}

export function useAutoFillGrid({
  itemCount,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  onFetchNextPage,
}: UseAutoFillGridOptions) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [gridTop, setGridTop] = useState(0);
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(380);

  const minimumItemsForViewport = useMemo(() => {
    if (gridWidth <= 0) {
      return 20;
    }

    const estimatedColumns = Math.max(1, Math.floor((gridWidth + 20) / 240));
    const visibleHeight = Math.max(0, viewportHeight - gridTop - 24);
    const estimatedRows = Math.max(1, Math.ceil(visibleHeight / estimatedRowHeight));

    return estimatedColumns * estimatedRows;
  }, [estimatedRowHeight, gridTop, gridWidth, viewportHeight]);

  useEffect(() => {
    const target = gridRef.current;

    if (!target || itemCount === 0) {
      return undefined;
    }

    const updateMetrics = () => {
      setGridWidth(target.clientWidth);
      setGridTop(target.getBoundingClientRect().top);
      setViewportHeight(window.innerHeight);

      const firstCard = target.querySelector("article");
      if (firstCard instanceof HTMLElement) {
        const styles = window.getComputedStyle(target.firstElementChild ?? target);
        const rowGap = Number.parseFloat(styles.rowGap || styles.gap || "0");
        setEstimatedRowHeight(firstCard.getBoundingClientRect().height + rowGap);
      }
    };

    updateMetrics();

    const observer = new ResizeObserver(() => {
      updateMetrics();
    });

    observer.observe(target);
    if (target.firstElementChild instanceof HTMLElement) {
      observer.observe(target.firstElementChild);
    }

    window.addEventListener("resize", updateMetrics);
    window.addEventListener("scroll", updateMetrics, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("scroll", updateMetrics);
    };
  }, [itemCount]);

  useEffect(() => {
    if (itemCount === 0) {
      return;
    }

    if (!hasNextPage || isFetchingNextPage || isLoading) {
      return;
    }

    if (itemCount >= minimumItemsForViewport) {
      return;
    }

    void onFetchNextPage();
  }, [
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    itemCount,
    minimumItemsForViewport,
    onFetchNextPage,
  ]);

  return {
    gridRef,
  };
}
