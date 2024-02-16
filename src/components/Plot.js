function Plot({ plot }) {
    if (plot !== '') {
        return (
            <img src={plot}  alt='plot of account growth over time'/>
        )
    }
}

export default Plot;