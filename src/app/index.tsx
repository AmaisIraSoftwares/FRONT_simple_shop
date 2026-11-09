import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Card,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
}

const INITIAL_ITEMS: ShoppingItem[] = [
  { id: '1', name: 'Arroz 5kg', quantity: '1 un', checked: false },
  { id: '2', name: 'Leite Integral', quantity: '3 cx', checked: true },
  { id: '3', name: 'Café em Pó', quantity: '500g', checked: false },
  { id: '4', name: 'Maçã Gala', quantity: '6 un', checked: false },
];

export default function ShoppingListScreen() {
  const theme = useTheme();
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL_ITEMS);
  const [nameInput, setNameInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const handleAddItem = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: trimmedName,
      quantity: quantityInput.trim() || '1 un',
      checked: false,
    };

    setItems((prev) => [newItem, ...prev]);
    setNameInput('');
    setQuantityInput('');
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.checked;
    if (filter === 'done') return item.checked;
    return true;
  });

  const completedCount = items.filter((i) => i.checked).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Content
          title="Lista de Compras"
          subtitle={`${completedCount} de ${items.length} itens comprados`}
          color={theme.colors.onPrimary}
        />
      </Appbar.Header>

      <View style={styles.contentWrapper}>
        <Card style={styles.inputCard} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Adicionar novo item
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                mode="outlined"
                label="Produto (ex: Pão de Forma)"
                value={nameInput}
                onChangeText={setNameInput}
                onSubmitEditing={handleAddItem}
                style={styles.nameInput}
                dense
              />
              <TextInput
                mode="outlined"
                label="Qtd"
                placeholder="1 un"
                value={quantityInput}
                onChangeText={setQuantityInput}
                onSubmitEditing={handleAddItem}
                style={styles.qtyInput}
                dense
              />
              <IconButton
                mode="contained"
                icon="plus"
                size={24}
                containerColor={theme.colors.primary}
                iconColor={theme.colors.onPrimary}
                onPress={handleAddItem}
                disabled={!nameInput.trim()}
                style={styles.addButton}
              />
            </View>
          </Card.Content>
        </Card>

        <View style={styles.filterRow}>
          <Chip
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            showSelectedOverlay
          >
            Todos ({items.length})
          </Chip>
          <Chip
            selected={filter === 'pending'}
            onPress={() => setFilter('pending')}
            showSelectedOverlay
          >
            Pendentes ({items.length - completedCount})
          </Chip>
          <Chip
            selected={filter === 'done'}
            onPress={() => setFilter('done')}
            showSelectedOverlay
          >
            Comprados ({completedCount})
          </Chip>
        </View>

        <Surface style={styles.listSurface} elevation={1}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                Nenhum item encontrado nesta categoria.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={Divider}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Checkbox
                    status={item.checked ? 'checked' : 'unchecked'}
                    onPress={() => toggleItem(item.id)}
                  />
                  <View
                    style={styles.itemInfo}
                    onTouchEnd={() => toggleItem(item.id)}
                  >
                    <Text
                      variant="bodyLarge"
                      style={[
                        styles.itemName,
                        item.checked && styles.itemChecked,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.itemQuantity}>
                      Quantidade: {item.quantity}
                    </Text>
                  </View>
                  <IconButton
                    icon="delete-outline"
                    iconColor={theme.colors.error}
                    size={22}
                    onPress={() => removeItem(item.id)}
                  />
                </View>
              )}
            />
          )}
        </Surface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
     width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    padding: 16,
    gap: 16,
  },
  inputCard: {
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 10,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    flex: 3,
  },
  qtyInput: {
    flex: 1,
    minWidth: 75,
  },
  addButton: {
    margin: 0,
    marginTop: 6,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  listSurface: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 8,
    cursor: 'pointer',
  },
  itemName: {
    fontWeight: '500',
  },
  itemChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  itemQuantity: {
    opacity: 0.65,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
  },
});
