import * as $ from 'jquery';
import actionCreatorFactory from 'typescript-fsa';
import bindThunkAction from 'typescript-fsa-redux-thunk';
import { CypherQueryResult, DocumentResult, NavResult, Neo4jRelation } from '../model';
import { Neo4jNode } from '../model';
import { RootState } from './reducer';
import * as _ from 'lodash';
import { CODE_SEARCH_URL, DOCUMENT_SEARCH_URL, NODE_INFO_URL, RELATION_LIST_URL } from '../config';

const actionCreator = actionCreatorFactory();

export const fetchDocumentResult = actionCreator.async<{ query: string }, DocumentResult[]>('FETCH_DOCUMENT_RESULT');
export const fetchDocumentResultWorker = bindThunkAction(
    fetchDocumentResult,
    async (params) => {
        return await $.post(DOCUMENT_SEARCH_URL, params);
    }
);

export const selectNode = actionCreator<number>('SELECT_NODE');
export const removeNode = actionCreator<number>('REMOVE_NODE');
export const addNodes = actionCreator<Neo4jNode[]>('ADD_NODES');

export const fetchNode = actionCreator.async<number, Neo4jNode>('FETCH_NODE');
export const fetchNodeWorker = bindThunkAction(
    fetchNode,
    async (params, dispatch, getState: () => RootState) => {
        const state = getState();
        if (state.graph.nodes.has(params)) {
            const node = state.graph.nodes.get(params);
            if (node.nonEmpty) {
                return node.get.node;
            }
        }
        return await $.post(NODE_INFO_URL, {id: params});
    }
);

export const addShownRelations = actionCreator<Neo4jRelation[]>('ADD_SHOWN_RELATIONS');
export const addRelations = actionCreator<Neo4jRelation[]>('ADD_RELATIONS');

export const fetchRelationList = actionCreator.async<number, string[]>('FETCH_RELATION_LIST');
export const fetchRelationListWorker = bindThunkAction(
    fetchRelationList,
    async (params, dispatch, getState: () => RootState) => {
        const state = getState();
        if (state.graph.relationLists.has(params)) {
            const list = state.graph.relationLists.get(params);
            if (list.nonEmpty) {
                return list.get;
            }
        }
        const result: Neo4jRelation[] = await $.post(RELATION_LIST_URL, {id: params});
        dispatch(addRelations(result));
        return _.uniq(result.map(r => `${r.startNode},${r.endNode}`));
    }
);

export const showRelations = actionCreator<string[]>('SHOW_RELATIONS');

export const fetchGraph = actionCreator.async<{ query: string }, {}>('FETCH_GRAPH');
export const fetchGraphWorker = bindThunkAction(
    fetchGraph,
    async (params, dispatch) => {
        const result: CypherQueryResult = await $.post(CODE_SEARCH_URL, {query: params.query});
        const nodes = result.nodes;
        const relations = result.relationships;

        dispatch(addNodes(nodes));
        dispatch(addShownRelations(relations));
        return {};
    });

export const fetchNavGraph = actionCreator.async<{}, NavResult>('FETCH_NAV_GRAPH');
export const fetchNavGraphWorker = bindThunkAction(
    fetchNavGraph,
    async () => {
        return await $.post(`${URL}/nav`, {});
    });