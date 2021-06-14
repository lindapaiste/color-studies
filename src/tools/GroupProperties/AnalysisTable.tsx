import React, { useMemo, useState } from "react";
import {
  Cell,
  Column,
  HeaderGroup,
  useSortBy,
  UseSortByColumnProps,
  useTable,
} from "react-table";
import { allGroups } from "data";
import { analyzeGroupProperties } from "logic/classification/averages/analyzeColors";
import { mapValues, round } from "lib";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Title,
} from "components";
import { PropertyAnalysis } from "logic/classification/averages/types";
import { allChannels, ChannelAdapter } from "logic";
import { CompareState, Comparison } from "./Comparison";

/**
 * Note: rows vs columns might be a bit backwards here.
 * It makes more sense to sort based on the channel values.
 * However there are so many channels that it is difficult to display without horizontal scrolling.
 */

/**
 * Type for the table row, used as the generic by react-table.
 * Need to include the channel. In order to use Record type without conflicting with channel,
 * the analyses need to be a nested property.
 */
type D = {
  channel: ChannelAdapter;
  analyses: Record<string, PropertyAnalysis>;
};

export const GroupsAnalysis = () => {
  const columns: Column<D>[] = useMemo(
    () => [
      {
        Header: "Channel",
        key: "channel",
        accessor: ({ channel }: D) => channel.title,
      },
      ...allGroups().map((group) => ({
        /**
         * The column header cell is the group's title.
         */
        Header: group.name,
        /**
         * Can also use the title as the key
         */
        key: group.name,
        /**
         * Need to return the sortable value here, so return the mean.
         * Row has access to the entire object, but only displays this one value.
         */
        accessor: ({ analyses }: D) => analyses[group.name].mean,
        /**
         * Round the value before displaying.
         */
        Cell: ({ value }: { value: number }) => round(value),
      })),
    ],
    []
  );
  /**
   * Each row must contain values for each group, so map over the channels
   * instead of over the groups.
   */
  const data: D[] = useMemo(() => {
    const groupAnalyses = Object.fromEntries(
      allGroups().map(({ name, hexes }) => [
        name,
        analyzeGroupProperties(hexes),
      ])
    );
    return allChannels().map((channel) => ({
      channel,
      analyses: mapValues(groupAnalyses, (o) => o[channel.key]),
    }));
  }, []);
  const tableInstance = useTable({ columns, data }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  /**
   * will have between 0 and 2 entries.  drop left when more than 2
   *
   * makes most sense to compare same property across groups,
   * but can also compare different properties within a group
   * so I am not forcing that the property is the same
   */
  const [compare, setCompare] = useState<CompareState[]>([]);

  /**
   * Info for the compare state is stored outside of the table.
   * Add a background color if it's selected and add a click handler to toggle selection.
   */
  const createExtraProps = (cell: Cell<D>) => {
    const property = cell.row.original.channel.key;
    const group = cell.column.id;
    const isCompare = compare.some(
      (o) => o.group === group && o.property === property
    );
    const onClick = () => {
      if (!isCompare) {
        const analysis = cell.row.original.analyses[group];
        setCompare((current) => [
          ...current.slice(-1),
          { group, property, analysis },
        ]);
      } else {
        setCompare((current) =>
          current.filter((o) => !(o.group === group && o.property === property))
        );
      }
    };
    return {
      onClick,
      style: isCompare ? { backgroundColor: "yellow" } : {},
    };
  };

  return (
    <div>
      {compare.length > 0 ? (
        <>
          <Title>Comparing Channels</Title>
          <Comparison compare={compare} />
        </>
      ) : (
        <p>Click on a cell to view detailed statistics.</p>
      )}
      <Title>Channel Averages</Title>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {
                /**
                 * Note: for some reason I need to assert that the column has
                 * sortability props.  But I can do it one place instead of three.
                 */
                (
                  headerGroup.headers as Array<
                    HeaderGroup<D> & UseSortByColumnProps<D>
                  >
                ).map((column) => (
                  <TableCell
                    component="th"
                    scope="col"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <TableSortLabel
                      active={column.isSorted ?? false}
                      direction={column.isSortedDesc ? "desc" : "asc"}
                    >
                      {column.render("Header")}
                    </TableSortLabel>
                  </TableCell>
                ))
              }
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <TableCell
                    {...cell.getCellProps()}
                    {...createExtraProps(cell)}
                  >
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
