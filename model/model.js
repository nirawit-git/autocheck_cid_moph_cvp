module.exports = {
    getList(db) {
        return db('patient AS p')
            .select('p.*')
            .leftJoin('moph_vaccine_history_api AS m', 'm.cid', 'p.cid')
            .where('m.cid', null)
            .where('p.cid', 'not like', '010733%')
            .where('p.death', '<>', 'Y')
            .where('p.cid', '<>', '0000000000000')
    },
    checkInsertDataHistory(db, cid, dose) {
        return db(process.env.DB_HIS_TABLE_NAME_UPDATE)
            .where('cid', cid)
            .where('vaccine_dose_no', dose)
    },
    insertDataHistory(db, data) {
        return db(process.env.DB_HIS_TABLE_NAME_UPDATE).insert(data)
    },
    getVaccineManufacturerID(db, text) {
        return db('vaccine_manufacturer')
            .where('vaccine_manufacturer_name', text)
    },
    getVaccineBookingTravel(db) {
        return db('vaccine_booking_travel')
    },
    getDataFormTable(db, table) {
        return db(table)
    },
    getFixBug(db) {
        const sql = `SELECT * from moph_vaccine_history_api WHERE immunization_datetime is null`;
        return db.raw(sql)
    },
    updateDataHistory(db, data, moph_vaccine_history_id) {
        return db('moph_vaccine_history_api')
            .update(data)
            .where('moph_vaccine_history_id', moph_vaccine_history_id)
    },
    ////////////////////////////////////////////////////////////////////////////
    getVaccineInventoryLabel(db, label_code) {
        const sql = `
        SELECT CONCAT(p.pname,p.fname,' ',p.lname) AS fullname,v.recipient_datetime AS datetime,o.vn,p.hn,v.label_code from ovst o
        LEFT JOIN patient p ON p.hn = o.hn
        LEFT JOIN vaccine_inventory_label v ON v.recipient_vn = o.vn
        WHERE v.label_code = '${label_code}'
        `;
        return db.raw(sql)
    },
    setNullVaccineInventoryLabel(db, label_code) {
        return db('vaccine_inventory_label')
            .update('recipient_vn', null)
            .where('label_code', label_code)
    },
    getHNformCID(db, cid) {
        return db('patient AS p')
            .select('p.hn', 'p.pname', 'p.fname', 'p.lname', 'p.addrpart', 'p.moopart', 'p.birthday', 'p.passport_no', 't.full_name')
            .leftJoin('thaiaddress AS t', 't.addressid', 'p.addressid')
            .where('cid', cid)
    },
    getNationality(db) {
        return db('nationality')
            .select('name', 'nationality', 'nhso_code')
    }
};