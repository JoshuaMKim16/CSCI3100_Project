import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import React from 'react'
import {Fragment} from 'react'

const markers = {}
const [activeMarker, setActiveMarker] = useState(null)
const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
        return
    }
    setActiveMarker(marker)
}

const Planner_map_temp = () => {
    const (isLoaded) = useLoadScript({
        googleMapApiKey = ''
    })

    return (
        <Fragment>
            <div className='container'>
                <div style={{width: '100%', height: '90vh'}}>
                    {isLoaded ? (
                        <GoogleMap center={{lat: 0.0000, lng: 0.0000}} zoom={16} onClick={() => setActiveMarker(null)} mapContainerStyle={{width: '100%', height: '90vh'}}>
                            {markers.map(({id, name, address}) => (
                                <MarkerF key={id} position={address} onClick={() => handleActiveMarker(id)}>
                                    {activeMarker === id ? <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                                        <div>{name}</div>
                                    </InfoWindowF> : null}
                                </MarkerF>
                            ))}
                        </GoogleMap>
                    ) : null}
                </div>
            </div>
        </Fragment>
    )
}

export default Planner_map_temp