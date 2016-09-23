import React, {Component} from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CityAirCard from './components/CityAirCard';
import Widget from './components/WidgetCard';
import WFSCard from './components/WFSCard';
import PortalCard from './components/PortalCard';
import LEOCard from './components/LEOCard';

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <div style={styles.container}>
      <WFSCard style={styles.card}/>
      <CityAirCard style={styles.card}/>
      <Widget style={styles.card}/>
      <PortalCard style={styles.card}/>
      <LEOCard style={styles.card}/>
    </div>
  </MuiThemeProvider>
);

const styles = {
  container: {
    width: '80%',
    margin: '0 auto'
  },
  card: {
    marginTop: '10px'
  }
};

render(<App/>, document.getElementById('app'));
