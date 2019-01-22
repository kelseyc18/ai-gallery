import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  headerButton: {
    height: 60,
    paddingLeft: 10,
    paddingRight: 10,
    border: 'none',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#58585A',
    ':hover': {
      backgroundColor: '#f0f0f0',
      color: '#222222',
    },
  },
});
