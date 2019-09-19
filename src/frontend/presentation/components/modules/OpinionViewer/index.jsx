import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import * as appActions from '@redux/App/AppReducer';
import ope from '@extension/operator';
import HomeRow from '@elements/HomeRow';
import RequestRow from '@elements/RequestRow';
import HomeItem from '@elements/HomeItem';
import RequestItem from '@elements/RequestItem';
import AppPropTypes from '@extension/AppPropTypes';
import OpinionInsertButton from '@elements/OpinionInsertButton';
import Responsible from '@modules/Responsible';
import AdsCard from '@elements/AdsCard';
import ad_config from '@constants/ad_config';
import { detected } from 'adblockdetect';

class OpinionViewer extends React.Component {
    static propTypes = {
        repositories: PropTypes.arrayOf(
            PropTypes.oneOfType([
                AppPropTypes.Content,
                AppPropTypes.Request,
                PropTypes.string,
            ])
        ),
        repository: AppPropTypes.Content,
        readOnly: PropTypes.bool,
        isAds: PropTypes.bool,
    };

    static adsKey = 'ads';

    static defaultProps = {
        repositories: [],
        isAds: false,
        readOnly: false,
    };

    state = {
        adBlocked: !ad_config.show_ads,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'OpinionViewer'
        );
    }

    componentDidMount = () => {
        this.setState({
            adBlocked: detected() || !ad_config.show_ads,
        });
    };

    render() {
        const {
            repositories,
            repository,
            current_user,
            isMyAccount,
            readOnly,
            isAds,
        } = this.props;

        const { adBlocked } = this.state;

        const _repositories = repositories;

        if (
            isAds &&
            _repositories.length > 0 &&
            !_repositories.includes(OpinionViewer.adsKey)
        ) {
            _repositories.splice(1, 0, OpinionViewer.adsKey);
        }

        const renderItem = items =>
            items.map(
                (item, key) =>
                    item == OpinionViewer.adsKey ? (
                        <div
                            className="opinion-viewer__ad"
                            key={key}
                            style={adBlocked ? { display: 'none' } : {}}
                        >
                            <AdsCard />
                        </div>
                    ) : (
                        <div className="opinion-viewer__item" key={key}>
                            <HomeItem repository={item} align={true} />
                        </div>
                    )
            );

        return (
            <div className="opinion-viewer">
                <div className="opinion-viewer__container">
                    <div className="opinion-viewer__items">
                        {!readOnly && (
                            <Responsible
                                className="opinion-viewer__inline"
                                defaultContent={
                                    <div className="opinion-viewer__button">
                                        <OpinionInsertButton
                                            repository={repository}
                                        />
                                    </div>
                                }
                                breakMd={true}
                            />
                        )}
                        {_repositories.length > 0 && renderItem(_repositories)}
                        {!readOnly && (
                            <Responsible
                                className="opinion-viewer__button"
                                breakingContent={
                                    <OpinionInsertButton
                                        repository={repository}
                                    />
                                }
                                breakMd={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({})
)(OpinionViewer);
