import * as React from 'react';
import { Button, Segment, Form, Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { useState, FormEvent, useContext, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ( { match, history } ) => {

  const activityStore = useContext( ActivityStore );
  const {
    createActivity,
    editActivity,
    submitting,
    activity: intialFormState,
    loadActivity,
    clearActivity,
  } = activityStore;


  const [activity, setActivity] = useState<IActivity>( {
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  } );

  useEffect( () => {
    if ( match.params.id && activity.id.length === 0 ) {
      loadActivity( match.params.id ).then(
        () => intialFormState && setActivity( intialFormState ) );
    }
    return () => {
      clearActivity();
    };
  }, [loadActivity, match.params.id, clearActivity, intialFormState, activity.id.length] );

  const handleSubmit = () => {
    if ( activity.id.length === 0 ) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity( newActivity ).then( () => history.push(`/activities/${newActivity.id}`));
    } else {
      editActivity( activity ).then(()=> history.push(`/activities/${activity.id}`));
    }
  };

  const handleInputChange = ( event: FormEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    const { name, value } = event.currentTarget;
    setActivity( { ...activity, [name]: value } );
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit} >
            <Form.Input
              onChange={handleInputChange}
              name='title'
              placeholder='Title'
              value={activity.title}
            />
            <Form.TextArea
              onChange={handleInputChange}
              name='description'
              rows={2}
              placeholder='Description'
              value={activity.description}
            />
            <Form.Input
              onChange={handleInputChange}
              name='category'
              placeholder='Category'
              value={activity.category}
            />
            <Form.Input
              onChange={handleInputChange}
              name='date'
              type='datetime-local'
              placeholder='Date'
              value={activity.date}
            />
            <Form.Input
              onChange={handleInputChange}
              name='city'
              placeholder='City'
              value={activity.city}
            />
            <Form.Input
              onChange={handleInputChange}
              name='venue'
              placeholder='Veneu'
              value={activity.venue}
            />
            <Button
              loading={submitting}
              floated='right'
              positive
              type='submit'
              content='Submit'
            />
            <Button
              onClick={() => history.push( '/activities' )}
              type='button'
              floated='right'
              content='Cancel'
            />
          </Form>
        </Segment>

      </Grid.Column>
    </Grid>
  );
};

export default observer( ActivityForm );