import ReactDOM from "react-dom";
import React, { useState } from 'react';
import HistoryIcon from "@patternfly/react-icons/dist/js/icons/history-icon";
import CubeIcon from "@patternfly/react-icons/dist/js/icons/cube-icon";
import { CheckCircleIcon } from '@patternfly/react-icons'

import * as PulpCoreClient from '@app/pulpcore-client';

import {
    Avatar,
    Brand,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ButtonVariant,
    Dropdown,
    Card,
    CardTitle,
    CardBody,
    DataList,
    DataListAction,
    DataListCell,
    DataListItem,
    DataListItemCells,
    DataListItemRow,
    Toolbar,
    ToolbarItem,
    ToolbarContent,
    ToolbarToggleGroup,
    ToolbarGroup,
    Divider,
    Drawer,
    DrawerActions,
    DrawerCloseButton,
    DrawerContent,
    DrawerContentBody,
    DrawerHead,
    DrawerPanelBody,
    DrawerPanelContent,
    DropdownToggle,
    DropdownItem,
    DropdownSeparator,
    Flex,
    FlexItem,
    Gallery,
    GalleryItem,
    InputGroup,
    KebabToggle,
    List,
    ListItem,
    Nav,
    NavItem,
    NavList,
    Page,
    PageHeader,
    PageSection,
    PageSectionVariants,
    PageSidebar,
    Progress,
    Select,
    SelectVariant,
    SelectOption,
    SkipToContent,
    Stack,
    StackItem,
    Text,
    TextContent,
    TextInput,
    Title,
    CardHeader
} from "@patternfly/react-core";

// type for state
type a_state = {
    pulpVersion: string,
    onWorkers: Array<Object>,
    onContApp: Array<Object>,
    dConnStat: Boolean,
    rConnStat: Boolean,
    total: number | undefined,
    used: number | undefined,
    free: number | undefined
}

const Status: React.FunctionComponent = () => {
    const [my_data, setData] = useState<a_state>({
        pulpVersion: "-1",
        onWorkers: [{name: "chestnuts", last_heartbeat: "38290138213"}],
        onContApp: [{ pulp_created: "2123721893", pulp_href: "safdhksdafjhksa", name: "dfsakhfsdja"}],
        dConnStat: false,
        rConnStat: false,
        total: 0,
        used: 0,
        free: 0
    });

    function statusREAD() {
        const setupData = async () => {
            const configuration = new PulpCoreClient.Configuration({username: 'admin', password: 'password', basePath: 'http://localhost:8080'});
            const statusAPI = new PulpCoreClient.StatusApi(configuration);
            const my_status = await statusAPI.statusRead();
            
            console.log(my_status);
            console.log(typeof my_status.data.online_workers);
            setData({
                pulpVersion: ' ' + my_status.data.versions[0].version,
                onWorkers: my_status.data.online_workers,
                onContApp: my_status.data.online_content_apps,
                dConnStat: my_status.data.database_connection.connected,
                rConnStat: my_status.data.redis_connection.connected,
                total: my_status.data.storage?.total,
                used: my_status.data.storage?.used,
                free: my_status.data.storage?.free
            });
        };
        setupData();
    }
    
    function on_click() {
        statusREAD();
    }

    React.useEffect(() => {
        statusREAD();
    }, []);

    function dConnection(){
        if(my_data.dConnStat){
            return  (<CardBody>CONNECTED<CheckCircleIcon> </CheckCircleIcon></CardBody>)
        }
        return  (<CardBody>DISCONNECTED</CardBody>)
    }
    function rConnection(){
        if(my_data.rConnStat){
            return  (<CardBody>CONNECTED<CheckCircleIcon> </CheckCircleIcon></CardBody>)
        }
        return  (<CardBody>DISCONNECTED</CardBody>)
    }
    function displayWorkers(){
        let listWorkers = "";
        my_data.onWorkers.forEach((worker) => {listWorkers += worker['name'] + ', '})
        listWorkers = listWorkers.substring(0, listWorkers.length - 2); 
        return <CardBody>{listWorkers}</CardBody>;
    }
    function displayOnContent(){
        let listContApps = "";
        my_data.onContApp.forEach((app) => {listContApps += app['name'] + ', '})
        listContApps = listContApps.substring(0, listContApps.length - 2); 
        return <CardBody>{listContApps}</CardBody>;
    }
    
    return ( 
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text>
                        <h1>Pulp 3 Status</h1>
                        <br></br>
                        
                        <Button onClick={on_click}> Get Status </Button>
                    </Text>
                    <br></br>
                    <Card>
                        <CardTitle>Pulpcore :</CardTitle>
                        <CardBody> <HistoryIcon />{my_data.pulpVersion}</CardBody>
                        <CardTitle>Known Workers: </CardTitle>
                            {displayWorkers()}
                        <CardTitle>Online Content Apps: </CardTitle>
                            {displayOnContent()}
                        <CardTitle>Database Connection Status: </CardTitle>
                            {dConnection()}
                        <CardTitle>Redis Connection Status: </CardTitle>
                            {dConnection()}
                        <CardTitle>Disk Usage: </CardTitle>
                        <CardBody>
                            <CardTitle>Total:</CardTitle>
                            <CardBody>{my_data.total}</CardBody>
                            <CardTitle>Used:</CardTitle>
                            <CardBody>{my_data.used}</CardBody>
                            <CardTitle>Free:</CardTitle>
                            <CardBody>{my_data.free}</CardBody>
                        </CardBody>
                    </Card>
                </TextContent>
            </PageSection>
        </Page >
    )
}


export { Status };