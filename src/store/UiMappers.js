/**
 * Created by scar on 4/11/17.
 */

export function navState(obj) {
    return obj.props.uistore.navigationState;
}

export function navVisible(obj) {
    return navState(obj).visible;
}
export function navTree(obj) {
    return navState(obj).tree;
}


export function thoughtOverviewState(obj) {
    return obj.props.uistore.thoughtOverviewState;
}

export function showTooltips(obj) {
    return uistore(obj).showTooltips;

}
export function getSelectedThought(obj) {
    return thoughtOverviewState(obj).selectedThought;
}
export function isThoughtPreviewEnabled(obj) {
    return thoughtOverviewState(obj).showHoverPreview;
}

export function processThoughtState(obj) {
    return obj.props.uistore.processThoughtState;
}
export function currentProcessThought(obj) {
    return processThoughtState(obj).current;
}

export function isDesktop(obj) {
    return !isMobile(obj)
}

export function isMobile(obj) {
    return obj.props.uistore.mobile;
}
export function uistore(obj) {
    return obj.props.uistore;
}

export function allTasks(obj) {
    return obj.props.store.getAllTasks;
}

export function taskTree(obj) {
    return obj.props.store.getTaskTree;
}

export function taskOverViewState(obj) {
    return obj.props.uistore.taskOverviewState
}
