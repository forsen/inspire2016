import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';


const LEOCard = (props) => (
  <Card
    {...props}
  >
    <CardHeader
      title="LEO"
      subtitle="Sensor"
      actAsExpander={true}
      showExpandableButton={true}
      avatar={require('../../images/leo.png')}
    />
    <CardText expandable={true}>
      <CardActions>
        <RaisedButton
          label="Manual"
          target="_blank"
          href="http://dump.unagi.no/LEOUserGuideV1.0.pdf"
        />
      </CardActions>
      The LEOs are portable sensor packs. It measures NO, NO2 and O3 using electrochemical sensors. It also provides the current temperature and relative humidity.
      The personal sensors together with the ExpoApp smartphone application from Ateknea Solutions.
    </CardText>
  </Card>
);

export default LEOCard;
