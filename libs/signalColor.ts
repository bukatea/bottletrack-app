// based on https://www.metageek.com/training/resources/understanding-rssi.html
export function getInfoFromRssi(rssi?: number | null) {
  if (rssi == null) {
    return {};
  }
  if (rssi >= -67) {
    return {
      strength: 'Excellent',
      color: 'lime'
    };
  }
  if (rssi >= -80) {
    return {
      strength: 'Good',
      color: '#ffbf00'
    };
  }
  return {
    strength: 'Poor',
    color: 'red'
  };
}