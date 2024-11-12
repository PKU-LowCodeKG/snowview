import * as React from 'react';
import { connect } from 'react-redux';
import SearchForm from '../../../components/SearchForm';
import GraphPanels from './GraphPanels';
import { fetchGraphWorker } from '../../../redux/action';
import { GRAPH_PREDEFINED_QUERIES } from '../../../config';
import { RootState } from '../../../redux/reducer';
import { RouteComponentProps } from 'react-router';
import { Grid, LinearProgress, WithStyles } from 'material-ui';
import { container } from '../../../variables/styles';
import withStyles from 'material-ui/styles/withStyles';
import DocSearch from '../../../components/DocSearch';

const styles = () => ({
  container: {
    paddingTop: '60px',
    ...container
  }
});

const mapStateToProps = (state: RootState) => ({
  query: state.graph.query,
  fetching: state.graph.fetching
});

interface GraphTabRouteProps {
  project: string;
}

type GraphTabStyles = WithStyles<'container'>;

interface GraphTabProps extends RouteComponentProps<GraphTabRouteProps> {
  query: string;
  fetching: boolean;
}

class GraphTab extends React.Component<GraphTabProps & GraphTabStyles, {}> {

  render() {
    const {project} = this.props.match.params;
    const {query, fetching, classes} = this.props;

    return (
      // <div>
      //   <DocSearch 
      //     callback={(param: { query: string }) => fetchGraphWorker({project, query: param.query})} 
      //   />
      //   {fetching ?
      //     <div className={classes.container}>
      //       <LinearProgress/>
      //     </div>  :
      //     <GraphPanels project={project}/>
      //   }
      // </div>

      <Grid container spacing={24}>
        <Grid item xs={4}> {/* xs={4} 表示在所有屏幕尺寸下占用4个栅格宽度 */}
          <DocSearch 
            callback={(param: { query: string }) => fetchGraphWorker({project, query: param.query})} 
          />
        </Grid>
        <Grid item xs={8}> {/* xs={8} 表示在所有屏幕尺寸下占用8个栅格宽度 */}
          {fetching ?
            <LinearProgress/> :
            <GraphPanels project={project}/>
          }
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(GraphTab));
