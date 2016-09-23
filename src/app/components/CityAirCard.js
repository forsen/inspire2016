import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';


const CityAirCard = (props) => (
  <Card
    {...props}
  >
    <CardHeader
      title="CityAir"
      subtitle="Application"
      actAsExpander={true}
      showExpandableButton={true}
      avatar={require('../../images/icon175x175.jpg')}
    />
    <CardText expandable={true}>
      <CardActions>
        <RaisedButton
          label="Source"
          target="_blank"
          href="https://git.nilu.no/citi-sense/cityair"
        />
        <RaisedButton
          label="Google Play Store"
          target="_blank"
          href="https://play.google.com/store/apps/details?id=io.cordova.CityAir&hl=no"
        />
        <RaisedButton
          label="iTunes App Store"
          target="_blank"
          href="https://itunes.apple.com/us/app/cityair-perception/id1045646666?mt=8"
        />
      </CardActions>
      CityAir is a smartphone application (App) for the public to express their perception of the outdoor air quality at
      their location. It allows users to collect and display individual perceptions of air quality, irrespective of
      where they are in the world. It also allows users to indicate the assumed source of the air pollution and write a
      comment.
    </CardText>
  </Card>
);

export default CityAirCard;
