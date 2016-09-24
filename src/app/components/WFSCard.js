import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

const WFSCard = (props) => (
  <Card
    {...props}
  >
    <CardHeader
      title="WFS"
      subtitle="Database"
      actAsExpander={true}
      showExpandableButton={true}
      avatar={require('../../images/ogcwfs.jpg')}
    />
    <CardText expandable={true}>
      <CardActions>
        <RaisedButton
          label={"Overview"}
          target="_blank"
          href={"http://co.citi-sense.eu/CitizensObservatoriesToolbox/SensorsandSensorPlatforms/ServerPlatforms/SEDSPlatform.aspx"}
        />
      </CardActions>
      <div style={styles.container}>
        <div style={styles.child}>
          <p>
            The sensordata from CITI-SENSE is stored in a WFS storage. The server can be accessed through its API at <a
            href="https://prod.citisense.snowflakesoftware.com/" target="_blank">https://prod.citisense.snowflakesoftware.com/</a>.
            A complete GET request using the filter on the right can be copied from this <a
            href="https://prod.citisense.snowflakesoftware.com/wfs?service=wfs&version=2.0.0&request=GetFeature&typename=cts:Observation&propertyName=cts:contains&count=500&filter=<Filter xmlns='http://www.opengis.net/fes/2.0' xmlns:cts='http:www.citi-sense.eu/citisense'><And><PropertyIsEqualTo><ValueReference>cts:sensorID/@xlink:href</ValueReference><Literal>LEO-666BA0B0</Literal></PropertyIsEqualTo><PropertyIsBetween><ValueReference>//cts:finishtime</ValueReference><LowerBoundary><Literal>2016-01-01T00:00:00</Literal></LowerBoundary><UpperBoundary><Literal>2016-12-22T00:00:00</Literal></UpperBoundary></PropertyIsBetween></And></Filter>"
            target="_blank">link</a>.
          </p>
        </div>
        <div style={styles.codeBlock}>
          <code>
            &lt;Filter xmlns='http://www.opengis.net/fes/2.0' <br/>xmlns:cts='http:www.citi-sense.eu/citisense'><br/>
            &nbsp;&lt;And><br/>
            &nbsp;&nbsp;&lt;PropertyIsEqualTo><br/>
            &nbsp;&nbsp;&nbsp;&lt;ValueReference>cts:sensorID/@xlink:href&lt;/ValueReference><br/>
            &nbsp;&nbsp;&nbsp;&lt;Literal>LEO-666BA0B0&lt;/Literal><br/>
            &nbsp;&nbsp;&lt;/PropertyIsEqualTo><br/>
            &nbsp;&nbsp;&lt;PropertyIsBetween><br/>
            &nbsp;&nbsp;&nbsp;&lt;ValueReference>//cts:finishtime&lt;/ValueReference><br/>
            &nbsp;&nbsp;&nbsp;&lt;LowerBoundary><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;Literal>2016-01-01T00:00:00&lt;/Literal><br/>
            &nbsp;&nbsp;&nbsp;&lt;/LowerBoundary><br/>
            &nbsp;&nbsp;&nbsp;&lt;UpperBoundary><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;Literal>2016-12-22T00:00:00&lt;/Literal><br/>
            &nbsp;&nbsp;&nbsp;&lt;/UpperBoundary><br/>
            &nbsp;&nbsp;&lt;/PropertyIsBetween><br/>
            &nbsp;&lt;/And><br/>
            &lt;/Filter><br/>
          </code>
        </div>
      </div>
    </CardText>
  </Card>
);

const styles = {
  container: {
    display: 'flex'
  },
  codeBlock: {
    backgroundColor: '#f7f7f7',
    font: '12px Consolas, "Liberation Mono", Menso, Courier, monospace',
    padding: '16px',
    flexGrow: '1'
  },
  child: {
    flexGrow: '1'
  }
};

export default WFSCard;

