
function sqlForPartialUpdate(dataToUpdate, jsToSql = {}){
    console.log(dataToUpdate, jsToSql);
    const keys = Object.keys(dataToUpdate);

    if(keys.length === 0) throw new Error("No data");

    const cols = keys.map(
        (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
    );

    console.log(cols);

    return {
        setCols: cols.join(", "),
        values: Object.values(dataToUpdate)
    }
}

export default sqlForPartialUpdate;