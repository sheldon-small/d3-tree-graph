const buildTreeStruct = (rootNodeId, rootNodeColor, links) => {
    // Assumptions: We assume that the target id is the current node's id,
    // and the source id is where it stems from or it's parent's id
    // hence we keep a dictinary of each node's index via its [id/current/target] and add a children array to each.

    const dict = {};
    const roots = [];
    let data;
    let node;

    if (links.length > 0) {

        for (let i = 0; i < links.length; i += 1) {
            dict[links[i].name] = i; // Initialize the [id/current id/target] Index Dict
            links[i].children = []; // Initialize the children
        }

        for (let link of links) {
            node = link;
            if (node.parent !== rootNodeId) {
                // 1. Find the index of the parent of the current node using the current node's [parentId/source.id]
                // 2. this extracts the current nodes parent object and pushes the current node to its parent's children array
                const parent = links[dict[node.parent]];
                if (parent?.children) {
                    parent.children.push(node);
                }
            } else {
                // This creats the first level braches from the parent node
                roots.push(node);
            }
        }
        
        // The d3 Tree graph looks for this tree data structure of parent child relationship
        // stemming from the root node {name:`node: ${rootNodeId}`, children:roots}
        data = roots.length > 0 ? {
            name: `node: ${rootNodeId}`,
            children: roots,
            color: rootNodeColor
        } : undefined;
    }

    return data;
}

const getClassification = (classValue, maxThresh, minThresh, classRange, gradient) => {
    const yieldIndex = Math.round((classValue*classRange)/(maxThresh - minThresh));
    const hex = gradient[yieldIndex-1];

    return hex;
}