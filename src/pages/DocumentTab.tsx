import * as React from 'react';
import { LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { DocumentResultState, RootState } from '../redux/reducer';
import RankRow from '../components/RankRow';
import SearchForm from '../components/SearchForm';
import { connect } from 'react-redux';
import { fetchDocumentResultWorker } from '../redux/action';
import { DOC_PREDEFINED_QUERIES } from '../config';
import { RouteComponentProps } from 'react-router';

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  table: {
    width: '70%',
  },
  progress: {
    flexGrow: 1,
    margin: theme.spacing.unit * 4
  }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
  documentResult: state.documentResult
});

interface DocumentTabRouteProps {
  project: string;
}

interface DocumentTabProps extends RouteComponentProps<DocumentTabRouteProps> {
  documentResult: DocumentResultState;
}

type DocumentTabStyle = WithStyles<'container' | 'table' | 'progress'>;

class DocumentTab extends React.Component<DocumentTabProps & DocumentTabStyle, {}> {

  render() {
    const {classes, documentResult} = this.props;
    const project = this.props.match.params.project;
    return (
      <div className={classes.container}>
        <SearchForm
          predefinedQueries={DOC_PREDEFINED_QUERIES}
          callback={(param: { query: string }) => fetchDocumentResultWorker({project, query: param.query})}
        />
        {documentResult.fetching && <LinearProgress className={classes.progress}/>}
        {documentResult.result != null && <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentResult.result
              .map(r => <RankRow
                key={r.id}
                initExpand={r.rank === 1}
                rank={r.rank}
                id={r.id}
                title={r.properties.title}
                detail={r.properties.html}
              />)}
          </TableBody>
        </Table>}
      </div>
    );
  }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(DocumentTab));
