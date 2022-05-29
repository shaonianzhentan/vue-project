import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'
import 'vxe-table/lib/style.css'

VXETable.setup({
    size: 'mini'
})

VXETable.formats.add('amount', ({ cellValue }, digits = 2) => {
    return XEUtils.commafy(XEUtils.toNumber(cellValue), { digits })
})

export default {
    install(app: import("vue").App<any>) {
        app.use(VXETable)
    }
}