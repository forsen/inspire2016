import React, {Component} from 'react';
import { render } from 'react-dom';
import {Card, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class WidgetCard extends Component {


  widgetFunction(widget) {
    switch(widget){
      case widgets.HISTORICALSENSORVALUES:
        return historicalSensorValues;
      case widgets.REALTIMESENSORVALUE:
        return realTimeSensorValue;
      default:
        return undefined;
    }
  };
  renderWidget(widget) {
    $(this.refs.sensor).html(
      this.widgetFunction(widget)()
    );
  }



  render() {
    return (
      <Card
        {...this.props}
      >
        <CardHeader
          title="Data visualization widgets"
          subtitle="Widget"
          actAsExpander={true}
          showExpandableButton={true}
          avatar={require('../../images/uhopper_logo.jpg')}
        />

        <CardText expandable={true}>
          Choose which widget you want to load
          <CardActions>
            <FlatButton label="Historical" onClick={() => {this.renderWidget(widgets.HISTORICALSENSORVALUES)}}/>
            <FlatButton label="Real Time" onClick={() => {this.renderWidget(widgets.REALTIMESENSORVALUE)}}/>
          </CardActions>
          <div ref="sensor" id="sensor" style={styles.container}></div>
          <footer>The widget(s) was(were) partly developed by the CITI-SENSE project. CITI-SENSE is a Collaborative Project partly funded by the EU FP7-ENV-2012 under grant agreement no. 308524.</footer>
        </CardText>
      </Card>
    )
  }
}


const styles = {
  container: {
    height: '500px',
    width: '70%',
    minWidth: '600px',
    margin: '0 auto'
  }
};

const widgets = {
  REALTIMESENSORVALUE: 1,
  HISTORICALSENSORVALUES: 2,
};



function historicalSensorValues() {
  $("#sensor").sensorstatistics({
    type: 'historic'
    , env: 'prod'
    ,filters: {
      sensorId: 'LEO-666BA0BF'
    }
    ,measurement: {
      type: 'value',
      observedProperty: 'NO'
    }
    ,storage_version: "v2"
    ,title: "NO2 Sensor"
    , subtitle: "PSP device"
//                ,from: "2014-01-01"
//                ,to: "2015-02-02"
  });
};

function realTimeSensorValue() {
  $("#sensor").sensorslookup({
    title: 'Widget title' // arbitrary
    , subtitle: 'Widget sub title' // arbitrary
    , type: 'list' // visualization type, map or list
    , env: 'prod' // or 'prod' for retrieving data from production or test environment (default is 'prod')
    , filters: {
      location: 'Barcelona'
    }
  });
};

export default WidgetCard;
