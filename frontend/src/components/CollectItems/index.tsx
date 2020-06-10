import React, { FC, PropsWithChildren } from "react";
import { Item } from "ecoleta-core";

import styles from "./index.module.css";

interface CollectItemsProps {
  items: Item[];
  selectedItems?: number[];
  onItemClick?: (id: number) => void;
}

const CollectItems: FC<PropsWithChildren<CollectItemsProps>> = ({
  items,
  selectedItems = [],
  onItemClick,
}) => {
  return (
    <ul className={styles.itemsGrid}>
      {items.map(({ id, image_url, title }) => (
        <li
          key={id}
          className={selectedItems.includes(id) ? styles.selected : ""}
          onClick={() => onItemClick?.call(onItemClick, id)}
        >
          <img src={image_url} alt={title} />
          <span>{title}</span>
        </li>
      ))}
    </ul>
  );
};

export default CollectItems;
