import React, {Component} from 'react';
import {render} from 'react-dom';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';

import RaisedButton from 'material-ui/RaisedButton';

class WidgetCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: {
        type: 'historic',
        env: 'prod',
        filters: {
          sensorId: 'LEO-666BA0BF',
        },
        measurement: {
          type: 'value',
          observedProperty: 'NO'
        },
        storage_version: "v2",
        title: "NO2 Sensor",
        subtitle: "PSP device"
      }
    };

    this.onChange = this.onChange.bind(this);
  }


renderWidget()
{
  console.log("rendering");

  $(this.refs.sensor).html(
    renderSensorValues(this.state)
  );
}
onChange(event) {
  this.state = {
    options: JSON.parse(event.target.value)
  };
  console.log(this.state)
}


render()
{
  return (
    <Card
      {...this.props}
      onExpandChange={(newExpandedState) => {
        if(newExpandedState) {
          this.renderWidget();
        }
      }}
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
          <RaisedButton label="Refresh" onClick={() => {
            this.renderWidget()
          }}/>
          <RaisedButton
            label="Manual"
            target="_blank"
            href={'http://citisense.u-hopper.com/pilots/common/'}
          />
        </CardActions>
        <div style={styles.container}>
          <div ref="sensor" id="sensor" style={styles.innerDiv}></div>
          <div style={styles.innerDiv}>
            <TextField
              floatingLabelText={'Options for widget'}
              id="options"
              defaultValue={JSON.stringify(this.state.options, null, 2)}
              onChange={this.onChange}
              multiLine={true}
              fullWidth={true}
            />
          </div>
        </div>
        <footer style={styles.footer}>The widget(s) was(were) partly developed by the CITI-SENSE project. CITI-SENSE is a Collaborative
          Project partly funded by the EU FP7-ENV-2012 under grant agreement no. 308524.
        </footer>
      </CardText>
    </Card>
  )
}
}


const styles = {
  container: {
    display: 'flex',
    height: '500px',
    width: '100%',
    minWidth: '600px',
    marginBottom: '30px'
  },
  innerDiv: {
    width: '100%',
    margin: '5px'
  },
  footer: {
    fontSize: '10px',
    color: 'darkgray'
  }
};

const widgets = {
  REALTIMESENSORVALUE: 1,
  HISTORICALSENSORVALUES: 2,
};


function renderSensorValues(state) {
  $("#sensor").sensorstatistics(state.options);
    /*
    {



    type: 'historic'
    , env: 'prod'
    , filters: {
      sensorId: 'LEO-666BA0BF'
    }
    , measurement: {
      type: 'value',
      observedProperty: 'NO'
    }
    , storage_version: "v2"
    , title: "NO2 Sensor"
    , subtitle: "PSP device"
//                ,from: "2014-01-01"
//                ,to: "2015-02-02"
  });
*/
};

function realTimeSensorValue() {
  $("#sensor").sensorslookup({
    title: 'Widget title' // arbitrary
    , subtitle: 'Widget sub title' // arbitrary
    , type: 'list' // visualization type, map or list
    , env: 'prod' // or 'prod' for retrieving data from production or test environment (default is 'prod')
    //, filters: {
    //  location: 'Barcelona'
    //}
  });
};

export default WidgetCard;
