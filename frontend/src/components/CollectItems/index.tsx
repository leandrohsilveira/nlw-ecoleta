import React, { FC, PropsWithChildren, useState } from "react";
import {
  Item,
  itemService,
  useApiCallback,
  useDidMountEffect,
} from "ecoleta-core";

import styles from "./index.module.css";

interface CollectItemsProps {
  selectedItems?: number[];
  onSelectedItemsChange?: (selectedItems: number[]) => void;
}

const CollectItems: FC<PropsWithChildren<CollectItemsProps>> = ({
  selectedItems = [],
  onSelectedItemsChange,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [fetch, , cancel] = useApiCallback(itemService.findAll, setItems);
  useDidMountEffect(() => {
    fetch();
    return () => cancel();
  });

  function handleItemClick(id: number) {
    if (onSelectedItemsChange) {
      if (selectedItems.includes(id))
        onSelectedItemsChange(selectedItems.filter((_id) => _id !== id));
      else onSelectedItemsChange([...selectedItems, id]);
    }
  }

  return (
    <ul className={styles.itemsGrid}>
      {items.map(({ id, image_url, title }) => (
        <li
          key={id}
          className={selectedItems.includes(id) ? styles.selected : ""}
          onClick={() => handleItemClick(id)}
        >
          <img src={image_url} alt={title} />
          <span>{title}</span>
        </li>
      ))}
    </ul>
  );
};

export default CollectItems;
