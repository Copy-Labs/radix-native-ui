import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'red' }}>
      {/*<Text>First open</Text>*/}
    </View>
    /*<ThemeProvider mode={'dark'}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'orange' }}>
        <Box style={styles.header}>
          <Heading size={5} style={styles.headerTitle}>
            Radix Themes Native
          </Heading>
          <Text size={3} style={styles.headerSubtitle}>
            Playground App for Testing Components
          </Text>
        </Box>
      </SafeAreaView>
    </ThemeProvider>*/
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flex: 1,
    backgroundColor: 'green',
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  demoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  demoRow: {
    marginTop: 8,
  },
  boxDemo: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#3B82F6',
  },
  flexItem: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#06B6D4',
  },
  gridDemo: {
    padding: 8,
  },
  gridItem: {
    aspectRatio: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insetDemo: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 12,
  },
  label: {
    marginBottom: 8,
  },
  codeDemo: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  kbdDemo: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 12,
  },
  blockquoteDemo: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    paddingLeft: 16,
  },
  iconText: {
    fontSize: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardText: {
    color: '#666',
  },
  progressContainer: {
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'column',
  },
  tabsList: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tabTrigger: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabContent: {
    padding: 16,
  },
  tabPane: {
    minHeight: 100,
  },
  tabText: {
    marginTop: 8,
    color: '#666',
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  themeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
});
