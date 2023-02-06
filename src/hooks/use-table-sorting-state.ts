import { SortingState, Updater } from "@tanstack/table-core";
import { StringParam, useQueryParams, withDefault } from "use-query-params";

export interface UseTableSortingStateProps {
  initialField?: string;
  initialDirection?: "asc" | "desc";
}

export function useTableSortingState({
  initialField = "",
  initialDirection = "desc",
}: UseTableSortingStateProps = {}) {
  const [sort, _setSort] = useQueryParams({
    orderByField: withDefault(StringParam, initialField),
    orderByDir: withDefault(StringParam, initialDirection),
  });

  const setSort = (input: Updater<SortingState>) => {
    _setSort((prev) => {
      const finalInput =
        typeof input === "function"
          ? input(toSortingState(prev.orderByField, prev.orderByDir))
          : input;

      const OrderBy = finalInput[0];
      if (!OrderBy) {
        return {
          orderByField: initialField,
          orderByDir: initialDirection,
        };
      }
      return {
        orderByField: OrderBy.id,
        orderByDir: OrderBy.desc ? "desc" : "asc",
      };
    });
  };

  return [toSortingState(sort.orderByField, sort.orderByDir), setSort] as const;
}

function toSortingState(field: string, direction: string): SortingState {
  return [
    {
      id: field,
      desc: direction === "desc",
    },
  ];
}
