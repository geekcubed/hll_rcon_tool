import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@material-ui/core/Grid";
import { showResponse, get, handle_http_errors } from "../../utils/fetchUtils";
import { toast } from "react-toastify";

import debounce from 'lodash/debounce'


class ServerStatus extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            nbPlayers: "",
            map: "",
            refreshIntervalSec: 10,
            interval: null
        }

        this.debouncedLoad = debounce(this.load.bind(this), this.state.refreshIntervalSec)
    }

    componentDidMount() {
        this.load()
        this.setState({interval: setInterval(
            this.debouncedLoad, 
            this.state.refreshIntervalSec * 1000)
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.interval)
    }

    async load(command) {
        return get(`get_status`)
            .then(response => showResponse(response, "get_status", false))
            .then(data => {
                this.setState({ name: data.result.name, map: data.result.map, nbPlayers: data.result.nb_players })
                document.title = `(${data.result.player_count}) ${data.result.short_name}`
            })
            .catch(handle_http_errors);
    }

    render() {
        const { map, name, nbPlayers } = this.state
        const { classes } = this.props

        return <React.Fragment>
            <Grid container className={classes.alignLeft} spacing={1}>
                <Grid item>
                    <strong style={{ display: "block" }} className={`${classes.ellipsis}`}>
                    {name}
                    </strong>
                    <small style={{ display: "block" }}>{nbPlayers} - {map}</small>
                </Grid>
            </Grid>
        </React.Fragment>
    }
}

export default ServerStatus