#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');
const argv = require('minimist')(process.argv.slice(2))

/**
 * 创建资源
 * @param {*} fileName 
 * @returns 
 */
function createAsset(fileName) {
    // 读取文件源码
    const sourceCode = fs.readFileSync(fileName, { encoding: 'utf-8'});
    // 使用babylon转换为抽象语法树
    const ast = babylon.parse(sourceCode, {
        sourceType: 'module',
    });
    // 获取import的其他依赖项
    const dependencies = [];
    traverse(ast, {
        ImportDeclaration: ({node}) => {
            // 修改路径为绝对路径
            node.source.value = path.resolve(path.dirname(fileName), node.source.value);
            dependencies.push(node.source.value);
        },
    });
    // 使用babel转换代码
    const { code } = transformFromAst(ast, null, {
        presets: ['env'],
    });

    return {
        fileName,
        code,
        dependencies,
    };
}

/**
 * 从入口递归创建依赖树数组
 * @param {*} entry 
 * @param {*} graph 
 * @returns 
 */
function createGraph(entry, graph = []) {
    const { fileName, code, dependencies } = createAsset(path.resolve(__dirname, entry));
    graph.push({
        fileName,
        code
    });
    for (const dependency of dependencies) {
        createGraph(dependency, graph);
    }
    return graph;
}

/**
 * 打包到输出
 * @param {*} graph 
 * @param {*} entry 
 * @param {*} output 
 */
function bundle(graph, entry, output) {
    const template = `
        (function(){
            const modules = {
                ${
                    graph.reduce((pre, current) => {
                        const { fileName, code } = current;
                        const str =  `
                            ${JSON.stringify(fileName)}: function(module, exports, require) {
                                ${code}
                            }
                        `;
                        return pre ? `
                        ${pre},
                        ${str}
                        ` : str;
                    }, '')
                }
            };
            const caches = {
            
            };
            
            function require(moduleId) {
                if (!caches.hasOwnProperty(moduleId)) {
                    const moduleO = {
                        exports: {},
                    };
                    modules[moduleId].call(null, moduleO, moduleO.exports, require)
                    return caches[moduleId] = moduleO.exports;
                }
                return caches[moduleId];
            }

            require(${JSON.stringify(entry)});
        })();
    `;
    fs.writeFileSync(output, template, { flag: 'w+' });
}



const entry = path.resolve(__dirname, './a.js');
const output = path.resolve(__dirname, '../dist/main.js');
const graph = createGraph(entry);

bundle(graph, entry, output);



